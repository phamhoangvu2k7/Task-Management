import { Request, Response } from "express";
import Task from '../model/task_model';
import User from '../model/user_model';
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/Search";

export const index = async (req: Request, res: Response) => {
    // Find
    interface Find {
        deleted: boolean,
        status?: string,
        title?: RegExp,
    }

    const find: Find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    // End Find

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.value;
    }
    // End Sort

    // Pagination
    const initPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );
    // End Pagination

    // Search
    const objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    // End Search

    if (req.query.page) {
        const tasks = await Task.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)
        res.json(tasks);
    }
    else {
        const tasks = await Task.find(find);
        res.json(tasks);
    }
}

export const detail = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const task = await Task.findOne({
            _id: id,
            deleted: false,
        });

        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy");
    }
}

export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id.toString();
        const status: string = req.body.status;

        await Task.updateOne({ _id: id }, { status: status });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id.toString();
        await Task.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });

        res.json({
            code: 200,
            message: "Xóa thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa không thành công!"
        });
    }
}

export const edit = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id.toString();
        await Task.updateOne({ _id: id }, req.body);

        res.json({
            code: 200,
            message: "Cập nhật thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        req.body.createdBy = (req as any).user.id;
        if (req.body.listUser.length) {
            for (let value of req.body.listUser) {
                const result = await User.findOne({
                    token: value,
                    deleted: false
                });
                if (!result) {
                    res.json({
                        code: 400,
                        message: "Token của thành viên không tồn tại!"
                    })
                    return;
                }
            }
        }
        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            message: "Tạo thành công!",
            data: data
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    }
}

export const changeMulti = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body.value;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });

                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                break;

            case "delete":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });

                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                });
                break;

            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                })
                break;
        }

    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    }
}