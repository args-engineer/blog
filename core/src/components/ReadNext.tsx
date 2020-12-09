import React from 'react';

import styled from '@emotion/styled';

import { inner, outer } from '../styles/shared';
import { PageContext } from '../templates/post';
import { PostCard } from './PostCard';
import { ReadNextCard } from './ReadNextCard';

interface ReadNextProps {
  tags: string[];
  currentPageSlug: string;
  relatedPosts: {
    totalCount: number;
    edges: Array<{
      node: {
        frontmatter: {
          date: string;
          title: string;
        };
        fields: {
          slug: string;
        };
      };
    }>;
  };
  pageContext: {
    prev: PageContext;
    next: PageContext;
  };
}

export const ReadNext = ({ relatedPosts, currentPageSlug, tags, pageContext }: ReadNextProps) => {
  const showRelatedPosts = relatedPosts.totalCount > 1;

  return (
    <ReadNextAside className="read-next" css={outer}>
      <div css={inner}>
        <ReadNextFeed className="read-next-feed">
          {showRelatedPosts && (
            <ReadNextCard
              currentPageSlug={currentPageSlug}
              tags={tags}
              relatedPosts={relatedPosts}
            />
          )}

          {pageContext.prev && <PostCard post={pageContext.prev} />}
          {pageContext.next && <PostCard post={pageContext.next} />}
        </ReadNextFeed>
      </div>
    </ReadNextAside>
  );
};

const ReadNextAside = styled.aside`
  .post-card:after {
    display: none;
  }
  .post-card-title {
    color: #fff;
    opacity: 0.8;
    transition: all 0.2s ease-in-out;
  }
  .post-card:hover .post-card-image {
    opacity: 1;
  }
  .post-card-excerpt {
    color: rgba(255, 255, 255, 0.6);
  }
  .static-avatar {
    border-color: #000;
  }
  .post-card-byline-content {
    color: rgba(255, 255, 255, 0.6);
  }
  .post-card-byline-content a {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const ReadNextFeed = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
