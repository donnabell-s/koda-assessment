from django.db import models
from django.core.exceptions import ValidationError

class Project(models.Model):
    class Status(models.TextChoices):
        PLANNING = 'Planning', 'Planning'
        IN_PROGRESS = 'In Progress', 'In Progress'
        ON_HOLD = 'On Hold', 'On Hold'
        COMPLETED = 'Completed', 'Completed'

    class Priority(models.TextChoices):
        LOW = 'Low', 'Low'
        MEDIUM = 'Medium', 'Medium'
        HIGH = 'High', 'High'

    client_name = models.CharField(max_length=255)
    project_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.PLANNING
    )
    priority = models.CharField(
        max_length=10, 
        choices=Priority.choices, 
        default=Priority.LOW
    )
    start_date = models.DateField()
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        if self.start_date and self.due_date and self.due_date < self.start_date:
            raise ValidationError({
                'due_date': 'Due date cannot be earlier than start date.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.project_name} ({self.client_name})"
