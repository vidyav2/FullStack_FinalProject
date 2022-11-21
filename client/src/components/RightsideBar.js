/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/RightsideBar.css";
import { SplitPane } from "react-multi-split-pane";

function RightsideBar() {
  const [simpleThought, setSimpleThought] = useState("");
  const [thoughtImageUrl, setThoughtImageUrl] = useState("");
  const [latestNews, setLatestNews] = useState("");

  const fetchThoughtData = async () => {
    const thoughtResult = await axios("/thoughts");
    const thoughtId = Math.floor(Math.random() * 10);
    setSimpleThought(thoughtResult.data[thoughtId].thought);
    setThoughtImageUrl(thoughtResult.data[thoughtId].imageUrl);
  };

  const fetchNews = async () => {
    try {
      const news = await axios("/latestNews");
      const data = news.data;
      if (data != null) {
        const newsList = [];
        for (let i = 0; i < data.length; i++) {
          let title = data[i].title;
          newsList.push(
            <li>
              <span className="newsSpan">
                <b>
                  {title}&nbsp;&nbsp;&nbsp;
                  <a href={data[i].link}>Details</a>
                </b>
              </span>
            </li>
          );
        }
        setLatestNews(newsList);
      }
    } catch (e) {
      if (e.message === "Request failed with status code 429") {
        console.log("Per day request limit reached for NewsData.io API..!!");
        setLatestNews("Per day request limit reached for NewsData.io API..!!");
      } else {
        console.log(e);
      }
    }
  };
  useEffect(() => {
    // Fetch thoughts from DailyDiaryDatabase
    fetchThoughtData();

    // Fetch latest news from NewsData.io API
    fetchNews();
  }, []);

  return (
    <React.Fragment>
      <SplitPane split="horizontal" minSize={30}>
        <div className="thoughtImageClass" style={{ backgroundImage: `url(${thoughtImageUrl})` }}>
          <p className="thoughtClass">{simpleThought}</p>
        </div>
        <div className="newsClass">
          <p className="latestNewsClass">Latest News</p>
          <ul>{latestNews}</ul>
        </div>
      </SplitPane>
    </React.Fragment>
  );
}

export default RightsideBar;
