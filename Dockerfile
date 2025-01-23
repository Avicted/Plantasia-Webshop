# Frontend build stage
FROM node:14 AS frontend

# Set the working directory for the frontend
WORKDIR /app/webshop/webshop-frontend

# Copy the frontend package files
COPY ./webshop/webshop-frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Build the frontend
COPY ./webshop/webshop-frontend .
RUN npm run build


# Base stage for the Django application
FROM python:3.9 AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory for the backend
WORKDIR /app

# Copy the requirements file first to leverage Docker's cache
COPY requirements.txt .

# Install dependencies
RUN python -m ensurepip --upgrade && \
    python -m pip install --no-cache-dir -r requirements.txt

# Copy the Django application code
COPY ./webshop /app/webshop

# Ensure Django is available before running migrations
RUN python -c "import django" || (echo "Django not found" && exit 1)

# Copy the built frontend files into the Django app
COPY --from=frontend /app/webshop/webshop-frontend/build /app/webshop/webshop-frontend/build

# Expose the port the app runs on
EXPOSE 8000
