// Interface pour la réponse de recherche
export interface SearchResponse {
  success: boolean;
  searchTerm: string; // Terme de recherche utilisé
  data: {
    took: number; // Temps pris pour la recherche
    timed_out: boolean; // Indique si la recherche a expiré
    _shards: {
      total: number; // Nombre total de shards
      successful: number; // Nombre de shards réussis
      skipped: number; // Nombre de shards ignorés
      failed: number; // Nombre de shards échoués
    };
    hits: {
      total: {
        value: number; // Nombre total de résultats
        relation: string; // Relation (par exemple, "eq" pour égal)
      };
      max_score: number; // Score maximum
      hits: Hit[]; // Tableau des résultats
    };
  };
}

// Interface pour chaque élément de la réponse de recherche
export interface Hit {
  _index: string; // Index du document
  _type: string; // Type du document
  _id: string; // ID du document
  _score: number; // Score du document
  _source: DocumentSource; // Source du document
  highlight?: HighlightData; // Données de surlignage (optionnel)
}

// Interface pour les données du document
export interface DocumentSource {
  content: string; // Contenu du document
  meta: MetaData; // Métadonnées du document
  file: FileData; // Données du fichier
}

// Interface pour les métadonnées du document
export interface MetaData {
  date?: string; // Date du document
  format?: string; // Format du document
  created?: string; // Date de création
  metadata_date?: string; // Date des métadonnées
}

// Interface pour les données du fichier
export interface FileData {
  extension: string; // Extension du fichier
  content_type?: string; // Type de contenu
  created?: string; // Date de création
  last_modified?: string; // Date de dernière modification
  last_accessed?: string; // Date de dernier accès
  indexing_date?: string; // Date d'indexation
  filesize?: number; // Taille du fichier
  filename: string; // Nom du fichier
  url?: string; // URL du fichier
  indexed_chars?: number; // Nombre de caractères indexés
  path?: FilePath; // Chemin du fichier
}

// Interface pour le chemin du fichier
export interface FilePath {
  root?: string; // Chemin racine
  virtual?: string; // Chemin virtuel
  real?: string; // Chemin réel
  stored?: boolean; // Indique si le fichier est stocké
}

// Interface pour les données de surlignage
export interface HighlightData {
  content: string[]; // Contenu surligné
}

// Interface pour les résultats de recherche dans l'interface
export interface SearchResult {
  id: string; // ID du résultat
  title: string; // Titre du résultat
  fileName: string; // Nom du fichier
  matchingPages: number[]; // Pages correspondantes
  totalPages: number; // Nombre total de pages
  highlights: string[]; // Surlignages
  fileUrl: string; // URL du fichier
  thumbnailUrls: string[]; // URL des vignettes
}

export interface LatestDocument {
  idDocument: string;
  Title: string;
  status: string;
  transferStatus: string;
  transferTimestamp: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  commentaires: {
    idComment: string;
    Contenu: string;
    createdAt: string;
    user: {
      idUser: string;
      NomUser: string;
    };
  }[];
  files: {
    idFile: string;
    name: string;
    url: string;
  }[];
  etape: {
    idEtape: string;
    LibelleEtape: string;
    Description: string;
    sequenceNumber: number;
  } | null;
}
