// Import necessary libraries
import React, { useState, useEffect } from "react";


function App() {
  const [news, setNews] = useState([]); // State to store news data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality

  // Fetch data from the API
  useEffect(()=>{
    const fetchData=async()=>{
      if (!searchTerm.trim()) 
        {
          setNews([]);//clear news if searchTerm is empty
          return
        }
      setLoading(true);
      setError(null);
      try{
        const response=await fetch(
          `https://newsdata.io/api/1/latest?apikey=pub_623640c789f844b9c126ba9f1ba2898627f0c&q=${searchTerm}`);
        if(!response.ok){
          throw new Error("Failed to fetch news data");
        }
        const data=await response.json();
        setNews(data.results || []);
      }
      catch(err){
        setError(err.message);
      }
      finally{
        setLoading(false);
      }
    };

    fetchData();
  },[searchTerm]);//Re-run effect when searchTerm changes

// Filter news by search term
/*const filteredNews=news.filter((article)=>{
 article.title.toLowerCase().includes(searchTerm.toLowerCase())
});*/


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
         <h1 className="text-3xl font-bold text-center mb-4">Latest News</h1>
         <input type="text" placeholder="Search For News..."
         className="w-full p-2 mb-4 border border-gray-300 rounded-lg "
         value={searchTerm}
         onChange={(e)=>setSearchTerm(e.target.value)}
         onKeyDown={(e)=>{
          if(e.key==='Enter'){
            setSearchTerm(e.target.value);
          }
         }}/>
      </div>

      {loading && <p className="text-center text-blue-500 animate-ping text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {news.length> 0 ?(
          news.map((article,index)=>(
            <div key={index} className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg ">
              <h2 className="text-lg font-semibold mb-2">
                {article.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {article.description || "No description available"}
              </p>
              {article.link && (
                <a href={article.link} target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline hover:text-orange-400">
                  Read More
                </a>
              )}
            </div>
          ))
        ) : (
          !loading && <p className="text-center">No News Article Found</p>
        )}

      </div>

    </div>
  )
}

export default App
