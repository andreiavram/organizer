# Generated by Django 3.2.8 on 2022-02-20 10:44

from django.db import migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_taskitem_for_today'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='taskitem',
            options={'ordering': ['order', '-priority', '-start_date', '-changed_date', '-created_date']},
        ),
        migrations.AlterField(
            model_name='taskitem',
            name='completed_date',
            field=model_utils.fields.MonitorField(blank=True, default=django.utils.timezone.now, monitor='completed', null=True, when={True}),
        ),
    ]