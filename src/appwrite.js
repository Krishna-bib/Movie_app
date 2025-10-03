import { Client, Databases, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;


const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)

const database = new Databases(client)

const updateSearchCount = async (searchTerm, movie) => {
  try {
    console.log("Updating search count for:", searchTerm);
    
    // 1. Check if the search term exists in the database
    const results = await database.listDocuments(
      DATABASE_ID, 
      COLLECTION_ID, 
      [Query.equal('searchTerm', searchTerm)]
    );
    
    // 2. If it exists, update the count
    if (results.documents.length > 0) {
      const doc = results.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
      console.log("Updated existing document:", doc.$id);
    } else {
      // 3. If it doesn't exist, create a new document
      const newDoc = await database.createDocument(
        DATABASE_ID, 
        COLLECTION_ID, 
        ID.unique(), 
        {
          searchTerm,
          count: 1,
          movie_id: movie.imdbID || 'unknown',
          poster_url: movie.Poster || 'no-poster',
        }
      );
      console.log("Created new document:", newDoc.$id);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
}

export const TredningMovies = async ()=>{
  try {
    const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
      Query.limit(5),
      Query.orderDesc("count"),
    ])

    return result.documents
  } catch (error) {
    console.log(error)
  }
}

export default updateSearchCount ;