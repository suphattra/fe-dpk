# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest

# Set the working directory
RUN mkdir /dpk_frondend
WORKDIR /dpk_frondend

# Add the source code to app
COPY ./ /dpk_frondend

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build

CMD ["npm","run", "start"]
# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
# FROM nginx:latest

# Copy the build output to replace the default nginx contents.
# COPY --from=build /usr/local/app/dist/sample-angular-app /usr/share/nginx/html

# Expose port 80
# EXPOSE 80

# docker run -d -p 8080:80 ovms:latest