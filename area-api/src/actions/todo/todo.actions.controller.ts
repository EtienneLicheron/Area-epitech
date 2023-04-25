import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CreateTodoActionDto } from "../dto/create-todo-action.dto";
import { TodoActionsService } from "./todo.actions.service";

@UseGuards(JwtAuthGuard)
@Controller("actions/todo")
export class TodoActionsController {
    constructor(
        private readonly todoActionsService: TodoActionsService,
    ) { }

    @Get("lists")
    async getLists(@Req() req: any): Promise<[object[], number]> {
        return this.todoActionsService.getLists(req.user);
    }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateTodoActionDto): Promise<void> {
        await this.todoActionsService.create(req.user, dto);
    }
}
