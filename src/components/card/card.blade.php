<article class="card" id="{{ $id }}">
    @if ($image || $video)
        <figure class="_figure">
            @if (@$image)
                @include('image.image', (array) $image)
            @elseif (@$video)
                @include('video.video', (array) $video)
            @endif
            @if (@$areaFigure)
                <div class="_area-figure">{!! $areaFigure !!}</div>
            @endif
        </figure>
    @endif
    @if ($body)
        <div class="_body">
            @if (@$areaBeforeBody)
                <div class="_area-before-body">
                    {!! $areaBeforeBody !!}
                </div>
            @endif
            @include('body.body', (array) $body)
            @if ($areaBody)
                <div class="_area-body">
                    {!! $areaBody !!}
                </div>
            @endif
            @if (@$areaAfterBody)
                <div class="_area-before-body">
                    {!! $areaAfterBody !!}
                </div>
            @endif
        </div>
    @endif
</article>