/* eslint-disable consistent-return */
import { Request, Response } from 'express';
import Role from '../models/role.model';

// Controller for creating a new Role document
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, privileges } = req.body;

    const newRole = await Role.create({ name, privileges });

    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for retrieving a Role document by ID
export const getRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.find();

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for retrieving a Role document by ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for updating a Role document
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { role, privileges } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      {
        role,
        privileges,
      },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(updatedRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for deleting a Role document
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);

    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(deletedRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
