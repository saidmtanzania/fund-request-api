/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import Project from '../models/project.model';
import AppError from '../utils/AppError';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';

export const getAllProject: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Project.find(filter), req.query).filter().sort().limitFields().paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;
  if (doc.length === 0) {
    return next(new AppError('Unfortunate!, There is no Project at the moment, try again later', 404));
  }
  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: doc,
  });
});

export const createProject: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const newProject = await Project.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      Project: newProject,
    },
  });
});

export const getProject: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

export const updateProject: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError('Project not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

export const deleteProject: RequestHandler = catchAsync(async (req: any, res: any, next: any) => {
  const proID = req.params.id;
  const project = await Project.findByIdAndDelete(proID);

  if (!project) {
    return next(new AppError('Project not found!', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Project deleted Successfully',
  });
});
