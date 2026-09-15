using System.ComponentModel.DataAnnotations;

namespace AIService.Application.Dtos;

public record SendMessageRequest(
    [Required, StringLength(2000, MinimumLength = 1)] string Message
);
