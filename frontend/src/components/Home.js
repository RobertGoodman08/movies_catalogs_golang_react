import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Ticket from "./../images/movie_tickets.jpg";
import "./style/Home.css";

export default class Home extends Component {

    render() {
        return (
            <div className="text-center">
            <h2>Найдите фильм для просмотра</h2>
            <hr />
            <Link to="/movies">
            <img src={Ticket} alt="movie ticket" />
            </Link>
            </div>
            
        );
    }
}
