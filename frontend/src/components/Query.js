import React, { Component } from 'react'

export default class Query extends Component {
    constructor(props) {
        super(props);
        this.state= {
            movies: [],
            isLoaded: false,
            error: null,
            alert: {
                type: "d-none",
                message: "",
            },

        }
    }

    componentDidMount() {
        const payload = `
        {
            list 
        }
        `

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json")

        const requestOptions = {
            method: "POST",
            body: payload,
            headers: myHeaders,
        }

        fetch(`http://127.0.0.1:4000/v1/graphql/list`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            let theList = Object.values(data.data.list);
            return theList;
        })
        .then((theList) => {
            console.log(theList);
        })
    }

    render() {
        return(
            <h2>GraphQL</h2>
        )
    }
}