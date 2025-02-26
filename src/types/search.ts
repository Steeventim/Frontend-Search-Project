// types/search.ts

// Interface pour la réponse de recherche
export interface SearchResponse {
  success: boolean;
  total: number;
  hits: Hit[];
}

// Interface pour chaque élément de la réponse de recherche
export interface Hit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlight: any;
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: DocumentSource;
}

// Interface pour les données du document
export interface DocumentSource {
  content: string;
  meta: MetaData;
  file: FileData;
  highlight: HighlightData;
}

// Interface pour les métadonnées du document
export interface MetaData {
  date: string;
  format: string;
  created: string;
  metadata_date: string;
}

// Interface pour les données du fichier
export interface FileData {
  extension: string;
  content_type: string;
  created: string;
  last_modified: string;
  last_accessed: string;
  indexing_date: string;
  filesize: number;
  filename: string;
  url: string;
  indexed_chars: number;
  path: FilePath;
}

// Interface pour le chemin du fichier
export interface FilePath {
  root: string;
  virtual: string;
  real: string;
  stored: boolean;
}

// Interface pour les données de surlignage
export interface HighlightData {
  content: string[];
}

// Interface pour les résultats de recherche dans l'interface
export interface SearchResult {
  id: string;
  title: string;
  fileName: string;
  matchingPages: number[];
  totalPages: number;
  highlights: string[];
  fileUrl: string;
  thumbnailUrls: string[];
}
