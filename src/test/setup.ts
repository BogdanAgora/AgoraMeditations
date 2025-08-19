import React from 'react';
import '@testing-library/jest-dom';

// Make React available globally for JSX
global.React = React;

// Mock environment variables for tests
process.env.YOUTUBE_API_KEY = 'test-api-key-12345'