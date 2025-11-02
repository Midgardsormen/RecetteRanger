import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SvelteRenderService } from './services/svelte-render.service';

@Controller()
export class AppController {
  constructor(private readonly svelteRenderService: SvelteRenderService) {}

  @Get()
  async getHome(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Home', {
      userName: 'Chef'
    });
    res.send(html);
  }

  @Get('recettes')
  async getRecettes(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Recettes', {
      recettes: []
    });
    res.send(html);
  }

  @Get('ingredients')
  async getIngredients(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Ingredients', {});
    res.send(html);
  }

  @Get('plannings')
  async getPlannings(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Plannings', {
      plannings: []
    });
    res.send(html);
  }

  @Get('shopping-lists')
  async getShoppingLists(@Res() res: Response) {
    const html = await this.svelteRenderService.render('ShoppingLists', {
      listes: []
    });
    res.send(html);
  }

  @Get('login')
  async getLogin(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Login', {});
    res.send(html);
  }

  @Get('register')
  async getRegister(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Register', {});
    res.send(html);
  }
}
