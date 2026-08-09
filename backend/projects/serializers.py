from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 
            'client_name', 
            'project_name', 
            'description', 
            'status', 
            'priority', 
            'start_date', 
            'due_date', 
            'created_at',
            'updated_at'
        ]

    def validate(self, data):
        # Additional validation check at the serializer level for clear DRF error responses
        start_date = data.get('start_date', getattr(self.instance, 'start_date', None))
        due_date = data.get('due_date', getattr(self.instance, 'due_date', None))

        if start_date and due_date and due_date < start_date:
            raise serializers.ValidationError({
                'due_date': 'Due date cannot be earlier than start date.'
            })
        return data