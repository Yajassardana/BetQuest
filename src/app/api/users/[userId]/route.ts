import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = (await params).userId;
  console.log(await params)
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(userDoc.data(), { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId  = ((await params).userId);
  const { result } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const userDocRef = doc(db, 'users', userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
    console.log("User not found", userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const fetchedUserData = userDoc.data();
    if(result == 'win'){
      await updateDoc(userDocRef, { 
        tokens: fetchedUserData.tokens + 50,
        contestsWon: fetchedUserData.contestsWon + 1,
        streak: fetchedUserData.streak + 1,
        previousResults: []
      });
    }
    else{
      await updateDoc(userDocRef, { 
        tokens: fetchedUserData.tokens - 50,
        contestsLost: fetchedUserData.contestsLost + 1,
        streak: 0,
        previousResults: []
      });
    }
    console.log("User updated successfully", userId)
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId  = ((await params).userId);
  const { tokens } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const userDocRef = doc(db, 'users', userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
    console.log("User not found", userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const fetchedUserData = userDoc.data();
      await updateDoc(userDocRef, { 
        tokens: fetchedUserData.tokens + tokens,
      });
    console.log("User updated successfully", userId)
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}