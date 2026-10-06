import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { GradientRibbon } from '../components/ui';

export const NotFoundPage = () => {
  return (
    <section className="band band-dark bleed -mt-6 min-h-[70vh] md:-mt-10">
      <div className="container-app flex min-h-[70vh] flex-col justify-center py-14 md:py-section">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl space-y-6">
            <p className="eyebrow">Error 404</p>
            <h1 className="text-display-xxl text-on-dark">404</h1>
            <p className="lead">Sorry, the page you visited does not exist.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/">
                <Button type="primary" size="large" className="btn-mint">
                  Back Home
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="large" className="btn-ghost-dark">
                  Browse courses
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[440px] lg:block">
            <GradientRibbon title="Brand gradient ribbon" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
