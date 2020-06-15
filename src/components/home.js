import React, { Component } from 'react'
import '../css/home.css'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { FaUserCircle } from 'react-icons/fa'
import { MdDoNotDisturbOn } from 'react-icons/md'
import { IconContext } from 'react-icons';
import Card from './card.js'
import Timer from './timer';
const request = require('request')

const rankColor = rating => {
  if(rating < 1200) return "#BFBAB2"
  else if(rating < 1400) return "#98FF98"
  else if(rating < 1600) return "#86FFF8"
  else if(rating < 1900) return "#3E7BE6"
  else if(rating < 2100) return "#EE6FEE"
  else if(rating < 2400) return "#F6AA4D"
  else return "#E03737"
}

class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
      userHandle : "",
      userRating : 0,
      userFName : "",
      userLName : "",
      userRank : "",
      userPic : "",
      userOrg : "",
      problemData : {},
      hideSearch : false,
      counts : { easy : 3, medium : 5, hard : 2 },
      mainTransition : false,
      showStopwatch : false,
      timedProblem : {},
      openForm : true
    }
  }
  
  handleHandleQuery = event => {
    this.setState({problemData : {}, hideSearch : false})
    request(`https://upsolve.herokuapp.com/suggest/${this.state.userHandle}/${this.state.counts.easy}/${this.state.counts.medium}/${this.state.counts.hard}`, (error, response, body) => {
      const data = JSON.parse(response.body)
      if(data["errorMessage"] !== undefined){
        window.alert(data["errorMessage"])
        this.setState({userHandle: "", problemData: {}})
      }
      else{
        for(var key in data)  this.setState({[key] : data[key]})
        this.setState({hideSearch: true, mainTransition: true})
      }
    })
    event.preventDefault()
  }

  handleHiddenQuery = event => event.preventDefault()

  handleHandleChange = event => this.setState({userHandle: event.target.value})

  handleReset = () => {
    this.setState({hideSearch: false})
    setTimeout(() => this.setState({userHandle: "", userFName: "", userLName: "", userRating: 0, problemData: {}, userRank: "", userPic: "", userOrg: ""}), 1000)
  }

  startTimer = problem => this.setState({showStopwatch: true, timedProblem: problem})

  stopTimer = () => this.setState({showStopwatch: false})

  componentDidMount(){
    setTimeout(() => this.setState({openForm : false}), 1000)
  }

  render(){
    return (
      <div className = "home"> 
        
        <form onSubmit = {this.state.hideSearch ? this.handleHiddenQuery : this.handleHandleQuery} onMouseEnter = {() => this.setState({openForm: true})} onMouseLeave = {() => this.setState({openForm: false})}>
          <div className = {`handle-box ` + (this.state.openForm ? "open " : "") + (this.state.hideSearch ? "hidden-handle" : "show-handle")}>
            <input className = "handle-input" style = {{caretColor: (this.state.userHandle === "" ? "whitesmoke" : "transparent")}} required name = "" disabled = {this.state.hideSearch} value = {this.state.userHandle} onChange = {this.handleHandleChange} placeholder = "Codeforces Handle" />
            <button type = "submit" className = "handle-button">
              <IconContext.Provider value = {{color: "whitesmoke", size: "2em"}}><FaUserCircle /></IconContext.Provider>
            </button>
          </div>
        </form>
        
        {!this.state.mainTransition || this.state.showStopwatch ? null :
        <div className = {"mainArea " + (this.state.hideSearch ? "show-main" : "hidden-main")}>
          
          <div className = "userInfo">
            <img className = "profile-pic" src = {`https:${this.state.userPic}`} alt = {this.state.userHandle} />
            <span className = "user">
              <table><tbody><tr>
              <td>{this.state.userFName} <a href = {`http://codeforces.com/profile/${this.state.userHandle}`} target="_blank" rel="noopener noreferrer" style = {{color: rankColor(this.state.userRating), textDecoration: "none"}}>{this.state.userHandle}</a> {this.state.userLName}</td>
              <td className = "ratingBadge"><NotificationBadge count={this.state.userRating} style = {{backgroundColor: rankColor(this.state.userRating), color: "#1d1e22", top: "0", right: "0"}} effect={Effect.SCALE}/></td>
              </tr></tbody></table>
              <span className = "reset-button" onClick = {this.handleReset}>
                <IconContext.Provider value = {{color: "#ff5e6c", size: "2em"}}><MdDoNotDisturbOn /></IconContext.Provider>
              </span>
            </span>
            <span className = "organization" style = {{fontSize: "15px"}}>{this.state.userOrg}</span>
          </div>

          <div className = "userStatistics">
            
          </div>

          {this.state.problemData.easy === undefined ? null :
          <div className = "problemSuggestions">
            <span>
              {this.state.problemData.easy.map(problem => (
                <tr key = {problem["name"]}><Card problem = {problem} difficulty = "easy" startTimer = {this.startTimer} /></tr>
              ))}</span>
            <span>
              {this.state.problemData.medium.map(problem => (
                <tr key = {problem["name"]}><Card problem = {problem} difficulty = "medium" startTimer = {this.startTimer} /></tr>
              ))}</span>
            <span>
              {this.state.problemData.hard.map(problem => (
                <tr key = {problem["name"]}><Card problem = {problem} difficulty = "hard" startTimer = {this.startTimer} /></tr>
              ))}</span>
          </div>}

        </div>}

        {!this.state.showStopwatch ? null :
          <Timer problem = {this.state.timedProblem} stopTimer = {this.stopTimer} handle = {this.state.userHandle}/>
        }
      </div>
    )
  }
}

export default Home