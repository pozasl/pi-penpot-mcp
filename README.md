# pi-penpot-mcp

AI-powered design workflows using [pi](https://github.com/earendil-works/pi-coding-agent) coding agent with [Penpot](https://penpot.app/) MCP server.

## Overview

This project demonstrates how to use AI agents to create, modify, and manage design files in Penpot through the Model Context Protocol (MCP). It includes a complete setup for running Penpot locally via Docker along with the MCP server integration.

## Features

- 🎨 Create UI designs programmatically using AI
- 🌴 Material Design 3 components with custom color schemes
- 🌓 Light and dark theme variants
- 🔒 Design quality validation (z-order, alignment, contrast)
- 📱 Mobile-first responsive layouts

## Setup

### Prerequisites

- Docker & Docker Compose
- pi coding agent
- Penpot MCP Server (included in this repo)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/pozasl/pi-penpot-mcp.git
cd pi-penpot-mcp

# Start Penpot and MCP services
docker-compose up -d

# Access Penpot at http://localhost:8080
# MCP server runs on port 3001
```

## Design Examples

This repository includes examples of AI-generated designs:

### Login Page
- Material Design 3 compliant login form
- Tropical color scheme (ocean teals, sunset ambers)
- Light and dark variants
- Email/password fields with floating labels
- Pill-shaped primary button

### User Profile Page
- Complete profile layout with avatar
- Stats section (posts, followers, following)
- Bio and contact information
- Edit and share action buttons
- Consistent tropical color palette

## Architecture

```
┌─────────────┐     MCP Protocol      ┌──────────────┐
│   pi Agent  │◄─────────────────────►│ Penpot MCP   │
│  (Coding    │                        │ Server       │
│   Assistant)│                        └──────┬───────┘
└─────────────┘                               │ WebSocket
                                              ▼
                                      ┌──────────────┐
                                      │  Penpot App  │
                                      │  (Docker)    │
                                      └──────────────┘
```

## Configuration

Environment variables are configured in `penpot.env`:
- `PENPOT_SECRET_KEY` - Shared secret for authentication between services
- Database and Redis connection settings

## Files

- `docker-compose.yaml` - Complete service orchestration
- `Dockerfile.penpot-mcp` - MCP server container build
- `Dockerfile.penpot-mcp-plugin` - Penpot plugin container build
- `penpot_mcp_client.js` - Example MCP client implementation
- `penpot.env` - Environment configuration

## Development Workflow

1. Describe your design requirements to pi
2. Pi uses Penpot MCP tools to create/modify designs
3. Review and iterate through conversation
4. Export final designs as SVG/PNG

## License

MIT
