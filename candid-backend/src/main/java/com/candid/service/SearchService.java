package com.candid.service;

import com.candid.dto.UserResponse;
import com.candid.entity.User;
import com.candid.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final UserService userService;

    public SearchResult search(String query, String currentEmail) {
        User currentUser = (currentEmail != null) ? userService.getUserEntityByEmail(currentEmail) : null;
        PageRequest pageable = PageRequest.of(0, 15);

        List<UserResponse> users = userRepository
                .findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(query, query, pageable)
                .getContent().stream()
                .map(u -> userService.mapToResponse(u, currentUser))
                .collect(Collectors.toList());

        return new SearchResult(users);
    }

    @Data
    public static class SearchResult {
        private final List<UserResponse> users;
    }
}
