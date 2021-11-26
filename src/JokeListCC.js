import React from "react";
import axios from "axios";
import Joke from "./JokeCC";
import LoadSpinner from "./LoadSpinnerCC";
import "./JokeList.css";

class JokeList extends React.Component{

  static defaultProps = { numJokesToGet : 10 };

  constructor(props){
    super(props);
    this.state = { jokes: [] };
    this.clearJokes = this.clearJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  async getJokes(){
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet){
        let res = await axios.get("https://icanhazdadjoke.com", { headers : { Accept: "application/json" } });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)){
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("Duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount(){
    await this.getJokes();
  }

  async componentDidUpdate(){
    if (this.state.jokes.length === 0){
      await this.getJokes();
    }
  }

  clearJokes(){
    this.setState({ jokes : [] });
  }

  vote(id, delta){
    const updated = this.state.jokes.map(j => (j.id === id ? {...j, votes: j.votes + delta} : j));
    this.setState({ jokes : updated });
  }

  render(){
    /* render: either loading spinner or list of sorted jokes. */
    const { jokes } = this.state;
    
    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.clearJokes}>
            Get New Jokes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }
  
    return <LoadSpinner />;
  }
}

export default JokeList;