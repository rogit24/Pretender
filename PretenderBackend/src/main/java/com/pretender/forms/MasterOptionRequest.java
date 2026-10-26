package com.pretender.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MasterOptionRequest(@NotBlank @Size(max = 120) String name) {}