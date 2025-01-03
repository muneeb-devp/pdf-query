import { db } from '@/lib/db';
import { userSubscription } from '@/lib/db/schema';
import crypto, { BinaryLike, Hmac } from 'crypto';
import { NextResponse } from 'next/server';



interface WebhookRequestBody {
  data: {
    attributes: {
      order_number: Number;
      customer_id: Number;
      user_name: string;
      user_email: string;
      status: string;
    }
  },
  meta: {
    custom_data: {
      userId: string;
    }
  }
}

export async function POST(req: Request) {
  try {
    const reqClone: Request = req.clone();
    const eventType: string | null = req.headers.get('X-Event-Name');
    const body: WebhookRequestBody = await req.json();

    const secret: string | undefined = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmac: Hmac = crypto.createHmac('sha256', secret as BinaryLike);
    const digest: Uint8Array = new Uint8Array(
      Buffer.from(hmac.update(await reqClone.text()).digest('hex'), 'hex')
    );
    const signature: Uint8Array = new Uint8Array(
      Buffer.from(req.headers.get('X-Signature') || '', 'hex')
    );

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    if (eventType === 'order_created') {
      const userId: string = body.meta.custom_data.userId;
      const isSuccessful: boolean = body.data.attributes.status === 'paid';

      if (isSuccessful) {
        const { user_email, user_name, customer_id, order_number } = body.data.attributes;

        await db.insert(userSubscription).values({
          orderId: `${order_number}`,
          userId,
          userEmail: user_email,
          username: user_name,
          customerId: customer_id,
        });
      }
    }

    return NextResponse.redirect(`${process.env.BASE_URL}/`);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
