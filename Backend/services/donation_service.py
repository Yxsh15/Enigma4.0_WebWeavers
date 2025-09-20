import razorpay
from fastapi import HTTPException, status
from utils.config import settings
from schemas.donation import Donation, DonationOrder
from utils.database import get_database
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class DonationService:
    @staticmethod
    async def create_order(donation: DonationOrder, currency: str = "INR"):
        """Create a Razorpay order"""
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            order_data = {
                "amount": int(donation.amount * 100),  # Amount in paise
                "currency": currency,
                "payment_capture": 1
            }
            order = client.order.create(data=order_data)
            return order
        except Exception as e:
            logger.error(f"Error creating Razorpay order: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create Razorpay order"
            )

    @staticmethod
    async def verify_payment(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str):
        """Verify a Razorpay payment"""
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            client.utility.verify_payment_signature(params_dict)
        except Exception as e:
            logger.error(f"Error verifying Razorpay payment: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment signature"
            )

    @staticmethod
    async def save_donation(donation_data: Donation, razorpay_payment_id: str):
        """Save donation details to the database and update project's raised amount"""
        try:
            db = await get_database()
            donations_collection = db.donations

            donation_data.status = "completed"
            donation_data.transaction_id = razorpay_payment_id
            donation_data.currency = "INR"

            await donations_collection.insert_one(donation_data.dict())

            # Update the project's raised amount, supporters count, and impact score
            projects_collection = db.projects
            await projects_collection.update_one(
                {"_id": ObjectId(donation_data.project_id)},
                {"$inc": {
                    "raisedAmount": donation_data.amount,
                    "supportersCount": 1,
                    "impactScore": int(donation_data.amount / 10) # Increment impact score by 1 for every 10 units of donation
                }}
            )
        except Exception as e:
            logger.error(f"Error saving donation to database: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save donation"
            )
