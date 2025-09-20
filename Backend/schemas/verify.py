from pydantic import BaseModel
from .donation import Donation

class Verify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    donation: Donation
