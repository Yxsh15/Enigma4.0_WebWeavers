from fastapi import APIRouter, HTTPException, status
from schemas.donation import Donation, DonationOrder
from schemas.verify import Verify
from services.donation_service import DonationService

router = APIRouter(prefix="/donations", tags=["donations"])

@router.post("/order")
async def create_order(donation: DonationOrder):
    """Create a Razorpay order"""
    order = await DonationService.create_order(donation=donation)
    return {"order_id": order["id"], "amount": order["amount"]}

@router.post("/verify")
async def verify_payment(verification: Verify):
    """Verify a Razorpay payment and save the donation"""
    await DonationService.verify_payment(
        razorpay_order_id=verification.razorpay_order_id,
        razorpay_payment_id=verification.razorpay_payment_id,
        razorpay_signature=verification.razorpay_signature
    )
    await DonationService.save_donation(verification.donation, verification.razorpay_payment_id)
    return {"status": "success"}
