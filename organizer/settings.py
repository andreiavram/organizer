"""
Django settings for organizer project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
from django.conf import global_settings
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

SECRET_KEY = '9anmibfq5gs_kuyze((oi^b&iim3v!uoo@3xws(%u=60ms-#c9'


DEBUG = True


ALLOWED_HOSTS = []

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'djangobower',
    'django_extensions',
    'crispy_forms',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',

    'corsheaders',

    'goodies',
    'organize',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'organizer.urls'

WSGI_APPLICATION = 'organizer.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, "templates"),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                "django.template.context_processors.request",
            ],
        },
    },
]

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")

from django.conf import global_settings
STATICFILES_FINDERS = global_settings.STATICFILES_FINDERS + ['djangobower.finders.BowerFinder', ]

BOWER_COMPONENTS_ROOT = os.path.join(BASE_DIR, "static")

BOWER_INSTALLED_APPS = (
    'angular-ui#0.4.0',
    'angular-mocks#1.3.15',
    'lodash#3.6.0',
    'angular#1.3.15',
    'less.js#2.5.0',
    'angular-route#1.3.15',
    'bootstrap#3.3.4',
    'angular-resource#1.3.15',
    'jquery#2.1.1',
    'angular-elastic',
    'ng-tags-input',
    'angular-nl2br',
    'angular-sanitize',
    'angularjs-color-picker')


STATICFILES_DIRS = (
    ("css", os.path.join(BASE_DIR, "static", "css")),
    ("js", os.path.join(BASE_DIR, "static", "js")),
    ("templates", os.path.join(BASE_DIR, "static", "templates"))
)

CRISPY_TEMPLATE_PACK = 'bootstrap3'

RECAPTCHA_PUBLIC_KEY = ""
RECAPTCHA_PRIVATE_KEY = ""
GOOGLE_API_KEY = ""

SITE_ID = 1
LOGIN_URL = "/admin/"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}

REST_AUTH_SERIALIZERS = {
    "TOKEN_SERIALIZER": "organize.serializers.UserTokenSerializer",
}


try:
    from local_settings import *
except ImportError:
    pass

