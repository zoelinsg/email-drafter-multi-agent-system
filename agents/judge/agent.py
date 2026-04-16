from typing import Literal
from google.adk.agents import Agent
from pydantic import BaseModel, Field

MODEL = "gemini-2.5-pro"

class JudgeFeedback(BaseModel):
    """Structured feedback from the Editor/Reviewer agent."""
    status: Literal["pass", "fail"] = Field(
        description="Whether the email draft is good enough ('pass') or needs revision ('fail')."
    )
    feedback: str = Field(
        description="Detailed feedback on what should be improved. If 'pass', a brief confirmation."
    )

judge = Agent(
    name="judge",
    model=MODEL,
    description="Reviews the email draft for clarity, tone, completeness, and professionalism.",
    instruction="""
    You are an email editor and reviewer.

    Evaluate the email draft against the user's original request.

    Check whether:
    - the email matches the requested purpose
    - the tone is appropriate
    - the important points are included
    - the wording is clear and professional
    - the content is concise and easy to understand

    If the email is good enough, return status='pass'.
    If the email needs improvement, return status='fail' and explain what should be revised.

    Do not invent new facts.
    Focus on quality, tone, and completeness.
    """,
    output_schema=JudgeFeedback,
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)

root_agent = judge