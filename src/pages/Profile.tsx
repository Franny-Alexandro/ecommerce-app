import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'supervisor':
        return 'Supervisor';
      default:
        return 'Cliente';
    }
  };

  const handleSave = async () => {
    if (!currentUser || !userProfile) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: displayName
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        updatedAt: new Date()
      });

      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error: any) {
      setError('Error al actualizar el perfil');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(userProfile?.displayName || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{userProfile.displayName || 'Usuario'}</h1>
                <p className="text-blue-100">{userProfile.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Personal
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{userProfile.displayName || 'No especificado'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{userProfile.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(userProfile.role)}`}>
                        {getRoleDisplayName(userProfile.role)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Miembro desde
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {new Date(userProfile.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancelar</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Editar Perfil</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Role-specific Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Accesos del Sistema
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Permisos Actuales:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {userProfile.role === 'admin' && (
                      <>
                        <li>✅ Acceso total al sistema</li>
                        <li>✅ Gestión de usuarios y supervisores</li>
                        <li>✅ Gestión de todos los productos</li>
                        <li>✅ Visualización de estadísticas</li>
                        <li>✅ Generación de reportes</li>
                      </>
                    )}
                    {userProfile.role === 'supervisor' && (
                      <>
                        <li>✅ Panel de supervisor</li>
                        <li>✅ Gestión de productos propios</li>
                        <li>✅ Visualización de ventas</li>
                        <li>✅ Gestión de inventario</li>
                      </>
                    )}
                    {userProfile.role === 'user' && (
                      <>
                        <li>✅ Compra de productos</li>
                        <li>✅ Lista de deseos</li>
                        <li>✅ Historial de pedidos</li>
                        <li>✅ Reseñas y comentarios</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Información de Seguridad */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">ℹ️ Información de Roles:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Todos los usuarios se registran como <strong>Cliente</strong></li>
                    <li>• Los roles <strong>Supervisor</strong> y <strong>Admin</strong> son asignados por administradores</li>
                    <li>• Contacta al administrador si necesitas permisos especiales</li>
                  </ul>
                </div>

                {/* Quick Access Links */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Accesos Rápidos:</h3>
                  <div className="space-y-2">
                    {userProfile.role === 'admin' && (
                      <a href="/admin" className="block text-blue-600 hover:text-blue-800 text-sm">
                        → Panel de Administración
                      </a>
                    )}
                    {userProfile.role === 'supervisor' && (
                      <a href="/supervisor" className="block text-blue-600 hover:text-blue-800 text-sm">
                        → Panel de Supervisor
                      </a>
                    )}
                    <a href="/orders" className="block text-blue-600 hover:text-blue-800 text-sm">
                      → Mis Pedidos
                    </a>
                    <a href="/wishlist" className="block text-blue-600 hover:text-blue-800 text-sm">
                      → Lista de Deseos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;