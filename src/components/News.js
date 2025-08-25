import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    try {
      props.setProgress(10);
      // Keep the existing URL structure but add the category parameter
      let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=95e68eb8e6054405bc5995328f5d3951`;
      
      // Add category parameter if it's not 'general'
      if (props.category && props.category !== 'general') {
        url += `&category=${props.category}`;
      }
      
      console.log('Fetching news from:', url);
      setLoading(true);
      let response = await fetch(url);
      console.log('Response status:', response.status);
      let parsedData = await response.json();
      console.log('API Response:', parsedData);
      
      if (!response.ok) {
        throw new Error(parsedData.message || 'Failed to fetch news');
      }
      
      props.setProgress(70);
      setArticles(parsedData.articles || []);
      setTotalResults(parsedData.totalResults || 0);
      setLoading(false);
      props.setProgress(100);
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles([]);
      setTotalResults(0);
      setLoading(false);
      props.setProgress(100);
    }
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;
      let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=95e68eb8e6054405bc5995328f5d3951&page=${nextPage}&pageSize=${props.pageSize}`;
      
      if (props.category && props.category !== 'general') {
        url += `&category=${props.category}`;
      }
      
      const response = await fetch(url);
      const parsedData = await response.json();
      
      if (!response.ok) {
        throw new Error(parsedData.message || 'Failed to fetch more news');
      }
      
      setPage(nextPage);
      setArticles(prevArticles => [...prevArticles, ...(parsedData.articles || [])]);
      setTotalResults(parsedData.totalResults || 0);
    } catch (error) {
      console.error('Error loading more news:', error);
    }
  };

  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              if (!element) return null;
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title || ""}
                    description={element.description || ""}
                    imageUrl={element.urlToImage || ""}
                    newsUrl={element.url || ""}
                    author={element.author || "Unknown"}
                    date={element.publishedAt || ""}
                    source={element.source?.name || "Unknown"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
  apiKey: "95e68eb8e6054405bc5995328f5d3951",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
};

export default News;
