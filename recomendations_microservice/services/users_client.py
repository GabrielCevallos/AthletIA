import os
import requests
from typing import Any, Dict


# Read users service URL from environment so containers can resolve by service name
USERS_SERVICE_URL = os.getenv('USERS_SERVICE_URL', 'http://athletia:3000')


def get_user(user_id: str, timeout: int = 5) -> Dict[str, Any]:
    """Fetch user data from the users microservice.

    Assumptions about the user payload (robust handling):
    - The service returns JSON with at least an 'id' field and optionally 'level' and 'goals' or 'objectives'.
    - 'level' is a string like 'beginner' or 'advanced'.
    - 'goals' or 'objectives' is a list of objective strings.

    Raises requests.RequestException on network errors.
    Returns the parsed JSON on success.
    """
    url = f"{USERS_SERVICE_URL}/users/{user_id}"
    resp = requests.get(url, timeout=timeout)
    resp.raise_for_status()
    return resp.json()
