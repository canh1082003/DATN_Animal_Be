import { QdrantClient } from '@qdrant/js-client-rest';
import config from '@/common/config/config';

class QdrantService {
  private client: QdrantClient;
  private static instance: QdrantService;

  private constructor() {
    this.client = new QdrantClient({
      url: config.API_QDRANT_URL || 'http://localhost:6333',
      apiKey: config.API_QDRANT_KEY,
    });
  }

  public static getInstance(): QdrantService {
    if (!QdrantService.instance) {
      QdrantService.instance = new QdrantService();
    }
    return QdrantService.instance;
  }

  public getClient(): QdrantClient {
    return this.client;
  }

  public async createCollection(collectionName: string, vectorSize: number) {
    try {
      await this.client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
      });
      console.info(`Collection ${collectionName} created successfully`);
    } catch (error) {
      console.error(`Error creating collection ${collectionName}:`, error);
      throw error;
    }
  }

  public async upsertPoints(collectionName: string, points: any[]) {
    try {
      await this.client.upsert(collectionName, {
        points: points,
      });
      console.info(`Points upserted successfully to ${collectionName}`);
    } catch (error) {
      console.error(`Error upserting points to ${collectionName}:`, error);
      throw error;
    }
  }

  public async search(
    collectionName: string,
    vector: number[],
    limit: number = 10
  ) {
    try {
      const searchResult = await this.client.search(collectionName, {
        vector: vector,
        limit: limit,
      });
      return searchResult;
    } catch (error) {
      console.error(`Error searching in ${collectionName}:`, error);
      throw error;
    }
  }
}

export default QdrantService;
