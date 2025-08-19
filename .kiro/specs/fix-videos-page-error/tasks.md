# Implementation Plan

- [x] 1. Create shared YouTube service layer
  - Create `src/lib/youtube.ts` with centralized YouTube API service class
  - Implement error handling types and interfaces for consistent error management
  - Add comprehensive logging utilities for debugging YouTube API calls
  - Write unit tests for the YouTube service with mocked API responses
  - _Requirements: 2.1, 2.2, 4.1, 4.2_

- [x] 2. Extract and standardize YouTube API logic
- [x] 2.1 Create YouTube service methods for channel videos
  - Implement `getChannelVideos` method that handles the search API call
  - Add proper error classification and logging for channel video requests
  - Include data transformation logic to convert YouTube API response to Video interface
  - Write unit tests for channel video fetching with various response scenarios
  - _Requirements: 1.1, 2.1, 4.2_

- [x] 2.2 Create YouTube service methods for playlist videos
  - Implement `getPlaylistVideos` method for playlist API calls
  - Extract existing playlist logic from playlist page components
  - Ensure consistent error handling and data transformation
  - Write unit tests for playlist video fetching
  - _Requirements: 2.1, 3.1, 4.2_

- [x] 2.3 Add API key validation utilities
  - Implement `validateApiKey` method to check API key validity at startup
  - Create environment variable validation with clear error messages
  - Add logging for API key validation results
  - Write tests for API key validation scenarios
  - _Requirements: 2.3, 4.1, 4.2_

- [x] 3. Refactor Videos page to use direct server components
- [x] 3.1 Update Videos page component
  - Remove client-side fetch call to `/api/videos` route
  - Implement direct server-side YouTube API call using shared service
  - Add proper error handling with user-friendly error messages
  - Ensure consistent data flow with Playlists page pattern
  - _Requirements: 1.1, 1.2, 3.1_

- [x] 3.2 Remove obsolete API route
  - Delete `src/app/api/videos/route.ts` file since it's no longer needed
  - Verify no other components depend on this API route
  - Update any references or imports that might break
  - _Requirements: 1.1, 2.1_

- [x] 4. Update Playlists to use shared service
- [x] 4.1 Refactor playlist page components
  - Update `src/app/playlists/[slug]/page.tsx` to use shared YouTube service
  - Replace direct API calls with service method calls
  - Ensure consistent error handling across all playlist pages
  - Maintain existing functionality while improving error handling
  - _Requirements: 2.1, 3.1, 4.3_

- [x] 4.2 Test playlist functionality
  - Write integration tests for playlist pages using shared service
  - Verify all existing playlists still work correctly
  - Test error scenarios with invalid API keys or network issues
  - _Requirements: 3.1, 4.3_

- [x] 5. Update Homepage YouTube integration
- [x] 5.1 Refactor homepage video fetching
  - Update `getLatestVideos` function in `src/app/page.tsx` to use shared service
  - Ensure consistent error handling and logging
  - Maintain existing caching behavior and performance
  - _Requirements: 2.1, 3.1_

- [x] 5.2 Test homepage integration
  - Verify homepage still displays latest videos correctly
  - Test error scenarios and fallback behavior
  - Ensure performance is maintained or improved
  - _Requirements: 3.1_

- [ ] 6. Implement comprehensive error handling
- [ ] 6.1 Create standardized error UI components
  - Create reusable error display components for YouTube API errors
  - Implement different error states (API key missing, quota exceeded, network error)
  - Add user-friendly error messages with troubleshooting hints
  - Write component tests for error display scenarios
  - _Requirements: 1.4, 2.3, 3.3_

- [ ] 6.2 Add error logging and monitoring
  - Implement detailed error logging for all YouTube API calls
  - Add request/response logging for debugging purposes
  - Create error classification system for better troubleshooting
  - Write tests for logging functionality
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 7. Add comprehensive testing
- [ ] 7.1 Write integration tests for Videos page
  - Test Videos page with successful API responses
  - Test Videos page with various error scenarios (invalid API key, quota exceeded)
  - Verify error messages are displayed correctly to users
  - Test loading states and data transformation
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 7.2 Write end-to-end tests
  - Create E2E tests that verify Videos page loads without errors
  - Test navigation from header Videos button to Videos page
  - Verify consistency between Videos and Playlists functionality
  - Test error recovery scenarios
  - _Requirements: 1.1, 3.1, 3.2_

- [ ] 8. Performance optimization and cleanup
- [ ] 8.1 Optimize YouTube API caching
  - Implement consistent caching strategy across all YouTube API calls
  - Add cache invalidation logic for fresh content
  - Optimize API call frequency to respect quota limits
  - Write tests for caching behavior
  - _Requirements: 3.2, 4.4_

- [ ] 8.2 Final validation and cleanup
  - Perform comprehensive testing of all YouTube-related features
  - Verify Videos page works consistently with Playlists and Homepage
  - Clean up any unused code or imports
  - Update documentation and comments
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1_