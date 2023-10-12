import dotenv from './dotenv';
import yaml from './yaml';

const YAML_EXTENSIONS = ['.yml', '.yaml'];

const getNthExtension = (filename: string, n: number) => {
  let dotIndex = filename.lastIndexOf('.');
  for (let i = 1; i < n; i += 1) {
    dotIndex = filename.lastIndexOf('.', dotIndex - 1);
    if (dotIndex === -1) {
      return '';
    }
  }
  const extension = filename.slice(dotIndex + 1);
  return extension;
};

const getByFilename = (filename: string) => {
  const extension = getNthExtension(filename, 1);
  if (extension === 'envienc') {
    const originalExtension = getNthExtension(filename, 2);
    if (YAML_EXTENSIONS.includes(originalExtension)) {
      return yaml;
    }
    return dotenv;
  }

  if (YAML_EXTENSIONS.includes(extension)) {
    return yaml;
  }

  return dotenv;
};

export default getByFilename;
