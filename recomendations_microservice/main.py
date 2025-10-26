from fastapi import FastAPI, HTTPException, Path
from starlette.responses import JSONResponse
import requests

from services import users_client
from core import recommender


app = FastAPI(title="Recommendations Service")


@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: str = Path(..., description="UUID of the user")):
    """Fetch user data from users-service and return rule-based recommendations.

    Response format:
    {
      "userId": <int>,
      "recommendations": [ {"type":"workout","title":"","description":"","difficulty":""} ]
    }
    """
    try:
        user = users_client.get_user(user_id)
    except requests.HTTPError as exc:
        # propagate user-service error
        status = exc.response.status_code if exc.response is not None else 502
        raise HTTPException(status_code=status, detail=f"User service error: {exc}")
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"User service not reachable: {exc}")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    recs = recommender.generate_recommendations(user)

    # Attempt to return numeric user id when available, otherwise the path id
    user_id_out = user.get("id") if isinstance(user, dict) and "id" in user else user_id

    payload = {"userId": user_id_out, "recommendations": recs}
    return JSONResponse(status_code=200, content=payload)
