import { NextApiRequest, NextApiResponse } from 'next';

import jackson from '@lib/jackson';
import { setErrorCookie } from '@lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { oauthController } = await jackson();
    const { redirect_url, app_select_form } = await oauthController.samlResponse(req.body);
    if (redirect_url) {
      res.redirect(302, redirect_url);
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(app_select_form);
    }
  } catch (err: any) {
    console.error('callback error:', err);
    const { message, statusCode = 500 } = err;
    // set error in cookie redirect to error page
    setErrorCookie(res, { message, statusCode }, { path: '/error' });
    res.redirect('/error');
  }
}
