from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import JWTError, jwt
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from ai.review import review_code_snippet

app = FastAPI()

load_dotenv()
# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = os.getenv("NEXTAUTH_SECRET", "your-default-secret")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="http://localhost:3000/api/auth/signin",
    tokenUrl="http://localhost:3000/api/auth/callback/github"
)

class TokenData(BaseModel):
    user_id: str | None = None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception



@app.post("/")
async def root():
    return {"message": "Welcome to GitAid API"}

@app.get("/api/health")
async def health_check():
    return {"status": "OK"}

@app.get("/api/protected")
async def protected_route(current_user: TokenData = Depends(get_current_user)):
    return {
        "message": "This is a protected endpoint",
        "user_id": current_user.user_id,
        "status": "authorized"
    }


from fastapi import Body

class UserAuthRequest(BaseModel):
    github_user_id: str

@app.post("/api/token")
async def generate_token(data: UserAuthRequest):
    to_encode = {"sub": data.github_user_id}
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": encoded_jwt}


class CodeReviewRequest(BaseModel):
    code: str
    language: str = "python"

@app.post("/api/review")
async def review_code(request: CodeReviewRequest):
    """Endpoint for AI code review."""
    review = review_code_snippet(request.code)
    return {"review": review}

import requests

class RepoReviewRequest(BaseModel):
    name: str
    url: str
    owner: str

@app.post("/api/analyze")
async def analyze_repo(data: RepoReviewRequest):
    """Fetches code from a GitHub repo and runs AI review."""
    try:
        # Step 1: Get repo contents via GitHub API
        repo_api_url = f"https://api.github.com/repos/{data.owner}/{data.name}/contents"
        response = requests.get(repo_api_url)

        if response.status_code != 200:
            return {"error": f"GitHub API error: {response.status_code}"}

        files = response.json()
        
        # Step 2: Filter to get a single Python file (or README as fallback)
        python_files = [f for f in files if f['name'].endswith(".py")]

        if not python_files:
            return {"error": "No Python files found in repo."}

        # Step 3: Fetch raw code content
        raw_file_url = python_files[0]['download_url']
        file_content = requests.get(raw_file_url).text

        # Step 4: Run Gemini review
        review = review_code_snippet(file_content)

        return {
            "filename": python_files[0]['name'],
            "review": review
        }

    except Exception as e:
        return {"error": str(e)}



class PRReviewRequest(BaseModel):
    owner: str
    repo: str
    pr_number: int


@app.post("/api/pr-review")
async def review_pull_request(data: PRReviewRequest):
    # GitHub API URL to get changed files in PR
    pr_url = f"https://api.github.com/repos/{data.owner}/{data.repo}/pulls/{data.pr_number}/files"
    headers = {"Authorization": f"Bearer {os.getenv('GITHUB_PAT')}"}
    response = requests.get(pr_url, headers=headers)

    if response.status_code != 200:
        return {"error": f"Failed to fetch PR files. Status: {response.status_code}"}

    files = response.json()
    code_to_review = ""

    for f in files:
        if f['filename'].endswith(".py") and f['patch']:
            code_to_review += f"# File: {f['filename']}\n{f['patch']}\n\n"

    if not code_to_review:
        return {"error": "No valid Python code changes found in PR."}

    review = review_code_snippet(code_to_review)
    return {"review": review}

