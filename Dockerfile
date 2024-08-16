# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  libmariadb-dev \
  libcairo2-dev \
  pkg-config \
  libdbus-1-dev \
  libgirepository1.0-dev \
  libcairo2-dev \
  gir1.2-glib-2.0 \
  && rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . /app/

# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the Django server when the container launches
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
