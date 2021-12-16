import React from 'react'
import { useState, useEffect } from "react";
import './CommentForm.css';


function CommentForm({ getComments, token, currentConstituency }) {

    const [title, setTitle] = useState();
    const [comment, setComment] = useState();
    const [category, setCategory] = useState("Recycling");

    const [user, setUser] = useState(null)

    useEffect(() => {
        if (token) {
            fetch(`http://localhost:8080/api/users/${token.userId}`,
            {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(token)
            })
            .then(response => response.json())
            .then(data => setUser(data))
        }
    }, [token])

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        if(comment && title && token){

            let Filter = require('bad-words'),
            filter = new Filter();
 
            let censoredComment = filter.clean(comment);
            let censoredTitle = filter.clean(title);
        
            const today = new Date();
            const dateTime = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            
            const commentToSubmit = {
                "userId" : user.id,
                "comment_title" : censoredTitle,
                "comment": censoredComment,
                "comment_category": category,
                "constituencyId": currentConstituency.constituency_id,
                "post_date": dateTime
            };

            console.log(commentToSubmit)
            const commentToSubmitJSON = JSON.stringify(commentToSubmit) 
        
            fetch(
                "http://localhost:8080/api/comments/add",
                {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    body: commentToSubmitJSON
                }
            )
            .then(response => {
                if(!response.ok){
                    return response.json().then(err => {throw new Error(err.message)})
                }
            })
            .then(() => getComments())
            .catch(err => {
                alert("Comment not posted. Please try again" + err);
            })
        }
        else if(comment && title && !token){
            alert("Not signed in. Please sign in to make comments")
        }
        else{
            alert("Please enter a valid comment")
        }

    }

    return (
        <form className="comment-form" onSubmit={handleCommentSubmit}>
            <h1 className="comment-header">Add Comment</h1>

            <label forhtml="title">Title</label>
            <input type="text" id="comment-title" onChange={(event) => setTitle(event.target.value)}/>

            <label forhtml="category">Choose a relevant category</label>
            <select id="categories" name="categories" onChange={(event) => setCategory(event.target.value)}>
                <option value="Recycling">Recycling</option>
                <option value="Pollution">Pollution</option>
                <option value="Policy">Policy</option>
                <option value="Energy">Energy</option>
                <option value="Farming">Farming</option>
            </select>

            <label forhtml="comment_body">Comment</label>
            <input type="text" id="comment-text" onChange={(event) => setComment(event.target.value)}/>

            <input type="submit" value="Leave comment"/>    
        </form>    
    )
}

export default CommentForm
