from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def home():
    return {"message": "Backend connected to Supabase"}

@app.get("/posts")
def get_posts():
    response = (
        supabase
        .table("posts")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return response.data

@app.post("/posts")
def create_post(post: dict):
    response = (
        supabase
        .table("posts")
        .insert({
            "title": post.get("title"),
            "content": post.get("content"),
            "author": post.get("author"),
        })
        .execute()
    )
    return response.data

@app.put("/posts/{post_id}")
def update_post(post_id: str, post: dict):
    response = (
        supabase
        .table("posts")
        .update({
            "title": post.get("title"),
            "content": post.get("content"),
            "author": post.get("author"),
        })
        .eq("id", post_id)
        .execute()
    )
    return response.data


@app.delete("/posts/{post_id}")
def delete_post(post_id: str):
    response = (
        supabase
        .table("posts")
        .delete()
        .eq("id", post_id)
        .execute()
    )
    return {"message": "deleted", "data": response.data}


@app.post("/posts/{post_id}/like")
def like_post(post_id: str):
    post_response = (
        supabase
        .table("posts")
        .select("likes")
        .eq("id", post_id)
        .single()
        .execute()
    )

    current_likes = post_response.data.get("likes") or 0

    response = (
        supabase
        .table("posts")
        .update({"likes": current_likes + 1})
        .eq("id", post_id)
        .execute()
    )

    return response.data


@app.post("/posts/{post_id}/share")
def share_post(post_id: str):
    post_response = (
        supabase
        .table("posts")
        .select("shares")
        .eq("id", post_id)
        .single()
        .execute()
    )

    current_shares = post_response.data.get("shares") or 0

    response = (
        supabase
        .table("posts")
        .update({"shares": current_shares + 1})
        .eq("id", post_id)
        .execute()
    )

    return response.data


@app.get("/posts/{post_id}/comments")
def get_comments(post_id: str):
    response = (
        supabase
        .table("comments")
        .select("*")
        .eq("post_id", post_id)
        .order("created_at", desc=False)
        .execute()
    )
    return response.data


@app.post("/posts/{post_id}/comments")
def create_comment(post_id: str, comment: dict):
    response = (
        supabase
        .table("comments")
        .insert({
            "post_id": post_id,
            "author": comment.get("author"),
            "content": comment.get("content"),
        })
        .execute()
    )
    return response.data

@app.post("/auth/signup")
def signup(user: dict):
    auth_response = supabase.auth.sign_up({
        "email": user.get("email"),
        "password": user.get("password"),
        "options": {
            "data": {
                "name": user.get("name"),
                "username": user.get("username"),
                "title": user.get("title"),
            }
        }
    })

    return {
        "user": auth_response.user,
        "session": auth_response.session
    }

@app.post("/auth/login")
def login(user: dict):
    auth_response = supabase.auth.sign_in_with_password({
        "email": user.get("email"),
        "password": user.get("password")
    })

    return {
        "user": auth_response.user,
        "session": auth_response.session
    }