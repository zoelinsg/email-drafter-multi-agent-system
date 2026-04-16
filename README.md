# Email Drafter Multi-Agent System

A distributed multi-agent email drafting system built with Google ADK, FastAPI, and Cloud Run.

## Overview

This project turns a single email-writing prompt into a multi-agent workflow.

Users provide:
- recipient type
- purpose
- tone
- language
- key points

The system then:
1. plans the email
2. reviews the plan
3. writes the final draft

## Agents

- **Researcher Agent**  
  Acts as the planner and creates the email plan.

- **Judge Agent**  
  Reviews the plan and decides whether it is good enough.

- **Content Builder Agent**  
  Writes the final email draft from the approved plan.

- **Orchestrator Agent**  
  Coordinates the workflow across all agents.

- **Frontend App**  
  Provides the web interface for user input and final output.

## Workflow

```text
Frontend
  -> Orchestrator
  -> Researcher
  -> Judge
  -> Content Builder
  -> Final Email Draft
```

## Tech Stack
* Python
* FastAPI
* Google ADK
* Vertex AI
* Cloud Run
* HTML / CSS / JavaScript

## Local Run
```bash
bash run_local.sh
```

## Cloud Run Services
* Frontend App: <YOUR_FRONTEND_CLOUD_RUN_URL>
* Orchestrator: <YOUR_ORCHESTRATOR_URL>
* Researcher: <YOUR_RESEARCHER_URL>
* Judge: <YOUR_JUDGE_URL>
* Content Builder: <YOUR_CONTENT_BUILDER_URL>

## Example Input
* Recipient Type: manager
* Purpose: request a one-day extension for delivery
* Tone: professional and polite
* Language: Traditional Chinese
* Key Points:
    * testing environment issue
    * 80% completed
    * can deliver by tomorrow 5 PM

