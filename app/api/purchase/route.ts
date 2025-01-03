import { NextResponse } from "next/server"
import { lemonInstance } from "@/lib/lemonsqueezy"
import { auth, currentUser, getAuth } from '@clerk/nextjs/server';

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    if (!data.productId)
      return NextResponse.json({ error: "productId is required" }, { status: 400 })

    const { userId } = await auth()
    const response = await lemonInstance.post('/checkouts', {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              userId: `${userId}`
            }
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: `${process.env.LEMONSQUEEZY_STORE_ID}`
            }
          },
          variant: {
            data: {
              type: "variants",
              id: `${data.productId}`
            }
          }
        }
      }
    })
    return NextResponse.json({ url: response.data.data.attributes.url }, { status: 200, statusText: 'OK' })
  } catch (error) {
    console.error(error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}