/* eslint-disable @typescript-eslint/no-explicit-any */
import Budget from '../models/budget.model';
import AppError from './AppError';

export default async (month: any, year: any, projectId: any, categoryId: any, next: any) => {
  const budget = await Budget.findOne({
    $expr: {
      $and: [{ $eq: [{ $year: '$month' }, year] }, { $eq: [{ $month: '$month' }, month] }],
    },
  });
  if (!budget) {
    return next(new AppError(`Budget not found for month: ${month} and year: ${year}`, 404));
  }

  const budgetItem = budget.items.find((item) => item.project.equals(projectId) && item.category.equals(categoryId));

  return budgetItem;
};
