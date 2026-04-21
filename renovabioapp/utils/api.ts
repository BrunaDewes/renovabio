import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:8080`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  return 'http://localhost:8080';
}

export function toApiFileUrl(path?: string | null) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('file://')) {
    return path;
  }

  return `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export function createImageFormData(uri: string, fieldName = 'file') {
  const extension = uri.split('.').pop()?.split('?')[0]?.toLowerCase();
  const normalizedExtension = extension && ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'jpg';
  const type = normalizedExtension === 'png' ? 'image/png' : normalizedExtension === 'webp' ? 'image/webp' : 'image/jpeg';
  const formData = new FormData();

  formData.append(fieldName, {
    uri,
    name: `imagem-${Date.now()}.${normalizedExtension}`,
    type,
  } as unknown as Blob);

  return formData;
}

export function getAuthHeaders(token?: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
