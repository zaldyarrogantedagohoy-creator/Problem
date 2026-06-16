const API_URL = import.meta.env.VITE_API_URL;

// POSTS
export async function getPosts() {
  const response = await fetch(`${API_URL}/posts`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function createPost(post: {
  title: string;
  content: string;
  author: string;
}) {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function updatePost(
  postId: string,
  post: {
    title: string;
    content: string;
    author: string;
  }
) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function deletePost(postId: string) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function likePost(postId: string) {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function sharePost(postId: string) {
  const response = await fetch(`${API_URL}/posts/${postId}/share`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

// COMMENTS
export async function getComments(postId: string) {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function createComment(
  postId: string,
  comment: {
    author: string;
    content: string;
  }
) {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

// AUTH
export async function signupUser(user: {
  name: string;
  username: string;
  email: string;
  password: string;
  title: string;
  bio: string;
}) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function loginUser(user: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}