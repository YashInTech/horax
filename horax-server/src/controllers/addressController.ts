import { Request, Response } from 'express'
import User from '../models/User'

// Add New Address
export const addAddress = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log('Incoming request body:', req.body) // Log the incoming request body
  try {
    const { userId } = req.params
    const {
      tag,
      deliveryName,
      deliveryNumber,
      streetAddress,
      city,
      state,
      zip,
    } = req.body

    if (
      !deliveryName ||
      !deliveryNumber ||
      !streetAddress ||
      !city ||
      !state ||
      !zip
    ) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const newAddress = {
      tag,
      deliveryName,
      deliveryNumber,
      streetAddress,
      city,
      state,
      zip,
    }
    user.addresses.push(newAddress)
    await user.save()

    return res
      .status(201)
      .json({ message: 'Address added successfully', address: newAddress })
  } catch (error) {
    console.error('Error adding address:', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    })
  }
}

// Update Address
export const updateAddress = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, addressId } = req.params
    const {
      tag,
      deliveryName,
      deliveryNumber,
      streetAddress,
      city,
      state,
      zip,
    } = req.body

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const address = user.addresses.find(
      (addr) => addr._id?.toString() === addressId
    )
    if (!address) return res.status(404).json({ message: 'Address not found' })

    // Update address fields
    address.tag = tag || address.tag
    address.deliveryName = deliveryName || address.deliveryName
    address.deliveryNumber = deliveryNumber || address.deliveryNumber
    address.streetAddress = streetAddress || address.streetAddress
    address.city = city || address.city
    address.state = state || address.state
    address.zip = zip || address.zip

    await user.save()
    return res
      .status(200)
      .json({ message: 'Address updated successfully', address })
  } catch (error) {
    console.error('Error updating address:', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    })
  }
}

// Delete Address
export const deleteAddress = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, addressId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.addresses = user.addresses.filter(
      (addr) => addr._id?.toString() !== addressId
    )
    await user.save()

    return res.status(200).json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    })
  }
}

// Get All Addresses
export const getAddresses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    return res.status(200).json({ addresses: user.addresses })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return res.status(500).json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    })
  }
}
