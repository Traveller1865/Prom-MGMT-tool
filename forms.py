from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, FloatField, IntegerField, DateField, FileField
from wtforms.validators import DataRequired, Email, EqualTo, Length, NumberRange
from flask_wtf.file import FileAllowed
from models import Tenant, Property, Document, Receipt, LeaseAgreement, LeaseHistory

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    role = SelectField('Role', choices=[('landlord', 'Landlord'), ('tenant', 'Tenant')], validators=[DataRequired()])
    submit = SubmitField('Sign Up')

class PropertyForm(FlaskForm):
    name = StringField('Property Name', validators=[DataRequired(), Length(max=100)])
    address = StringField('Address', validators=[DataRequired(), Length(max=200)])
    rent_amount = FloatField('Rent Amount', validators=[DataRequired(), NumberRange(min=0)])
    beds = IntegerField('Number of Bedrooms', validators=[DataRequired(), NumberRange(min=0)])
    baths = FloatField('Number of Bathrooms', validators=[DataRequired(), NumberRange(min=0)])
    sqft = IntegerField('Square Footage', validators=[DataRequired(), NumberRange(min=0)])
    dwelling_type = SelectField('Dwelling Type', choices=[
        ('single_family', 'Single Family'),
        ('apartment', 'Apartment'),
        ('condo', 'Condo'),
        ('townhouse', 'Townhouse'),
        ('duplex', 'Duplex'),
        ('other', 'Other')
    ], validators=[DataRequired()])
    lease_term = SelectField('Lease Term', choices=[
        ('month_to_month', 'Month-to-Month'),
        ('6_months', '6 Months'),
        ('1_year', '1 Year'),
        ('2_years', '2 Years')
    ], validators=[DataRequired()])
    vacancy_status = SelectField('Vacancy Status', choices=[
        ('vacant', 'Vacant'),
        ('occupied', 'Occupied')
    ], validators=[DataRequired()])
    thumbnail = FileField('Property Thumbnail', validators=[
        FileAllowed(['jpg', 'png', 'jpeg'], 'Images only!')
    ])
    submit = SubmitField('Add Property')

class TenantForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=100)])
    contact_email = StringField('Email', validators=[DataRequired(), Email()])
    phone_number = StringField('Phone Number', validators=[DataRequired(), Length(max=15)])
    emergency_contact = StringField('Emergency Contact', validators=[DataRequired(), Length(max=100)])
    application_status = SelectField('Application Status', choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], validators=[DataRequired()])
    property_id = SelectField('Property', coerce=int, choices=[], validators=[DataRequired()])
    background_check = FileField('Background Check', validators=[FileAllowed(['pdf'], 'PDF only!')])  # Limit to PDF for background checks
    lease_start = DateField('Lease Start Date', validators=[DataRequired()])
    lease_end = DateField('Lease End Date', validators=[DataRequired()])
    rent_amount = FloatField('Rent Amount', validators=[DataRequired(), NumberRange(min=0)])
    submit = SubmitField('Add Tenant')

    def __init__(self, *args, **kwargs):
        super(TenantForm, self).__init__(*args, **kwargs)
        # Dynamically populate the choices for property_id from the database
        self.property_id.choices = [(property.id, property.name) for property in Property.query.all()]
        # Add a fallback if no properties are found
        self.property_id.choices = [(p.id, p.name) for p in Property.query.all()] or [('', 'No Properties')]

class ReceiptForm(FlaskForm):
    property_id = SelectField('Property', coerce=int, validators=[DataRequired()])
    expense_category = SelectField('Category', choices=[
        ('maintenance', 'Maintenance'),
        ('repairs', 'Repairs'),
        ('utilities', 'Utilities')
    ], validators=[DataRequired()])
    amount = FloatField('Amount', validators=[DataRequired()])
    receipt_file = FileField('Receipt', validators=[
        FileAllowed(['jpg', 'png', 'pdf'], 'Images and PDFs only!'),
        DataRequired()  # Ensure that the user can't submit the form without a file
    ])
    submit = SubmitField('Upload Receipt')
